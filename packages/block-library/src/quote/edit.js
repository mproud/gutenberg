/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import {
	AlignmentToolbar,
	BlockControls,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	RichText,
} from '@wordpress/block-editor';
import {
	BlockQuotation,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

export default function QuoteEdit( {
	attributes,
	setAttributes,
	isSelected,
	className,
	insertBlocksAfter,
	mergedStyle,
	clientId,
} ) {
	const [ withCitation, setWithCitation ] = useState( false );
	const { align, citation } = attributes;
	const blockProps = useBlockProps( {
		className: classnames( className, {
			[ `has-text-align-${ align }` ]: align,
		} ),
		style: mergedStyle,
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps );
	const isAncestorOfSelectedBlock = useSelect( ( select ) =>
		select( 'core/block-editor' ).hasSelectedInnerBlock( clientId )
	);

	// On mount, initialize withCitation depending on the citation value.
	useEffect( () => {
		if ( ! RichText.isEmpty( citation ) ) {
			setWithCitation( true );
		}
	}, [] );

	let shouldCitationBeVisible = ! RichText.isEmpty( citation );
	if ( isSelected || isAncestorOfSelectedBlock ) {
		shouldCitationBeVisible = withCitation;
	}

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ align }
					onChange={ ( nextAlign ) => {
						setAttributes( { align: nextAlign } );
					} }
				/>
				<ToolbarGroup>
					<ToolbarButton
						isActive={ withCitation }
						label={ __( 'Toogle citation visibility' ) }
						onClick={ () => {
							if ( true === withCitation ) {
								// Reset text if it's transitioning to hidden.
								setAttributes( { citation: '' } );
							}
							setWithCitation( ! withCitation );
						} }
					>
						{ __( 'Add citation' ) }
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			<BlockQuotation { ...innerBlocksProps }>
				{ innerBlocksProps.children }
				{ shouldCitationBeVisible && (
					<RichText
						identifier="citation"
						value={ citation }
						onChange={ ( nextCitation ) =>
							setAttributes( {
								citation: nextCitation,
							} )
						}
						__unstableMobileNoFocusOnMount
						aria-label={ __( 'Quote citation text' ) }
						placeholder={
							// translators: placeholder text used for the citation
							__( 'Write citation…' )
						}
						className="wp-block-quote__citation"
						textAlign={ align }
						__unstableOnSplitAtEnd={ () =>
							insertBlocksAfter( createBlock( 'core/paragraph' ) )
						}
					/>
				) }
			</BlockQuotation>
		</>
	);
}
